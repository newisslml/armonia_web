// Copiar como "Jenkinsfile" a la raiz del repo (funciona para ramas/PRs que
// traigan solo backend/, solo frontend/, o ambos — detecta que hay y corre
// solo lo que aplica)
import groovy.transform.Field

@Field Map stageResults = [:]
@Field String failureReason = null
@Field List STAGE_ORDER = [
  'Detectar estructura', 'Backend: install', 'Backend: prisma', 'Backend: lint',
  'Backend: format check', 'Backend: tests + coverage', 'Frontend: install',
  'Frontend: tests + coverage', 'Coverage Reconciliation',
  'Security: secrets (gitleaks)', 'Security: SAST (semgrep)', 'Handbook Compliance'
]

def runStage(String name, Closure body) {
  long start = System.currentTimeMillis()
  try {
    body()
    stageResults[name] = [status: 'OK', ms: System.currentTimeMillis() - start]
  } catch (e) {
    stageResults[name] = [status: 'FAIL', ms: System.currentTimeMillis() - start]
    failureReason = "${name}: ${e.message}"
    throw e
  }
}

def humanDuration(long ms) {
  if (ms < 1000) { return "${ms}ms" }
  double s = ms / 1000
  if (s < 60) { return "${Math.round(s)}s" }
  int m = (s / 60) as int
  long rem = Math.round(s % 60)
  return "${m}min ${rem}s"
}

pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    DATABASE_URL = "postgresql://ci:${POSTGRES_TEST_PASSWORD}@postgres-test:5432/ci_test?schema=b${BUILD_NUMBER}"
    POSTGRES_TEST_PASSWORD = credentials('postgres-test-password')
  }

  stages {
    stage('Detectar estructura') {
      steps {
        script {
          runStage('Detectar estructura') {
            // backend: package.json quedo en la raiz del repo (no en backend/),
            // usa npm (package-lock.json), mientras que backend/src y
            // backend/prisma siguen donde estaban. frontend sigue con pnpm
            // en su propia carpeta.
            env.HAS_BACKEND = fileExists('package.json') ? 'true' : 'false'
            env.HAS_FRONTEND = fileExists('frontend/package.json') ? 'true' : 'false'
            echo "package.json (backend, raiz): ${env.HAS_BACKEND} | frontend/package.json: ${env.HAS_FRONTEND}"

            def paths = []
            if (fileExists('backend')) { paths << 'backend' }
            if (fileExists('frontend')) { paths << 'frontend' }
            if (paths.isEmpty()) { paths << '.' }
            env.SCAN_PATHS = paths.join(' ')
          }
        }
      }
    }

    stage('Backend: install') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        script { runStage('Backend: install') { sh 'npm ci' } }
      }
    }

    stage('Backend: prisma') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        script {
          runStage('Backend: prisma') {
            sh 'npx prisma generate --schema=backend/prisma/schema.prisma'
            sh 'npx prisma migrate deploy --schema=backend/prisma/schema.prisma'
          }
        }
      }
    }

    stage('Backend: lint') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        script { runStage('Backend: lint') { sh 'npx eslint backend --max-warnings=0' } }
      }
    }

    stage('Backend: format check') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        script { runStage('Backend: format check') { sh 'npx prettier --check backend' } }
      }
    }

    stage('Backend: tests + coverage') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        script {
          runStage('Backend: tests + coverage') {
            sh 'npx vitest run --coverage'
          }
        }
        // coverage-summary.json (reporter json-summary) es lo que compara
        // el stage de Coverage Reconciliation; si el proyecto todavia no
        // tiene ese reporter configurado, no se genera y se saltea sin fallar
        archiveArtifacts artifacts: 'coverage/coverage-summary.json', allowEmptyArchive: true, fingerprint: false
      }
    }

    stage('Frontend: install') {
      when { environment name: 'HAS_FRONTEND', value: 'true' }
      steps {
        script {
          runStage('Frontend: install') {
            dir('frontend') {
              sh 'pnpm install --frozen-lockfile'
            }
          }
        }
      }
    }

    stage('Frontend: tests + coverage') {
      when { environment name: 'HAS_FRONTEND', value: 'true' }
      steps {
        script {
          runStage('Frontend: tests + coverage') {
            dir('frontend') {
              sh 'pnpm exec vitest run --coverage'
            }
          }
        }
        archiveArtifacts artifacts: 'frontend/coverage/coverage-summary.json', allowEmptyArchive: true, fingerprint: false
      }
    }

    stage('Coverage Reconciliation') {
      // solo tiene sentido en PRs: compara contra el ultimo build ok de dev.
      // en dev mismo, el archiveArtifacts de arriba ya deja el baseline
      // listo para la proxima PR.
      when { expression { env.CHANGE_ID != null } }
      steps {
        script { runStage('Coverage Reconciliation') {
          copyArtifacts(
            projectName: 'armonia_web/dev',
            selector: lastSuccessful(),
            filter: 'coverage/coverage-summary.json,frontend/coverage/coverage-summary.json',
            target: 'baseline',
            optional: true
          )

          def check = { label, currentPath, baselinePath ->
            if (!fileExists(currentPath)) { return }
            if (!fileExists(baselinePath)) {
              echo "${label}: sin baseline todavia (primer build con coverage), no se compara."
              return
            }
            def result = sh(
              script: """
                python3 -c "
import json, sys
cur = json.load(open('${currentPath}'))['total']['lines']['pct']
base = json.load(open('${baselinePath}'))['total']['lines']['pct']
print(f'${label}: actual={cur}% baseline={base}%')
sys.exit(1 if cur < base else 0)
"
              """,
              returnStatus: true
            )
            if (result != 0) {
              error("${label}: coverage bajo respecto a dev (ver log arriba)")
            }
          }

          check('backend', 'coverage/coverage-summary.json', 'baseline/coverage/coverage-summary.json')
          check('frontend', 'frontend/coverage/coverage-summary.json', 'baseline/frontend/coverage/coverage-summary.json')
        } }
      }
    }

    stage('Security: secrets (gitleaks)') {
      steps {
        script { runStage('Security: secrets (gitleaks)') { sh 'gitleaks detect --source . --no-git -v' } }
      }
    }

    stage('Security: SAST (semgrep)') {
      steps {
        script {
          runStage('Security: SAST (semgrep)') {
            // reglas genericas OWASP/comunidad, nada del handbook todavia
            sh "semgrep --config auto --severity ERROR --severity WARNING --error ${env.SCAN_PATHS}"
          }
        }
      }
    }

    stage('Handbook Compliance') {
      steps {
        script {
          runStage('Handbook Compliance') {
            // reglas propias del handbook, separadas del SAST generico
            // para que se vea aparte en el reporte
            sh "semgrep --config .semgrep/handbook.yml --severity ERROR --severity WARNING --error ${env.SCAN_PATHS}"
          }
        }
      }
    }
  }

  post {
    always {
      script {
        def status = currentBuild.currentResult // SUCCESS, FAILURE, UNSTABLE
        def color = status == 'SUCCESS' ? 3066993 : (status == 'UNSTABLE' ? 16776960 : 15158332) // verde / amarillo / rojo
        def statusIcon = status == 'SUCCESS' ? '✅' : (status == 'UNSTABLE' ? '⚠️' : '❌')
        def prUrl = env.CHANGE_URL ?: env.BUILD_URL

        def commit = (env.GIT_COMMIT ?: sh(script: 'git rev-parse HEAD', returnStdout: true).trim())
        def shortCommit = commit.take(7)
        def author = env.CHANGE_AUTHOR ?: sh(script: 'git log -1 --pretty=format:%an', returnStdout: true).trim()

        def stageIcon = { st -> st == 'OK' ? '✅' : (st == 'FAIL' ? '❌' : '⏭️') }
        def stageLines = STAGE_ORDER.collect { name ->
          def r = stageResults[name]
          r == null ? "${stageIcon('SKIP')} ${name}" : "${stageIcon(r.status)} **${name}** — ${humanDuration(r.ms)}"
        }.join('\n')

        def failureBlock = (status != 'SUCCESS' && failureReason) ? "\n\n**Fallo en:** `${failureReason}`" : ''

        def description = """**Branch:** `${env.BRANCH_NAME ?: '-'}`${env.CHANGE_ID ? " | **PR:** #${env.CHANGE_ID}" : ''} | **Autor:** ${author} | **Commit:** `${shortCommit}`

```
PIPELINE REPORT — ${statusIcon} ${status}
```

${stageLines}${failureBlock}

[Ver build #${env.BUILD_NUMBER} en Jenkins](${env.BUILD_URL})"""

        def payload = groovy.json.JsonOutput.toJson([
          embeds: [[
            title: "🔧 CI Pipeline — armonia_web",
            url: prUrl,
            color: color,
            description: description
          ]]
        ])
        writeFile file: 'discord_payload.json', text: payload

        // credencial 'discord-webhook-url' opcional: si no esta cargada aun,
        // solo se saltea el aviso en vez de tumbar el build entero
        try {
          withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK')]) {
            sh 'curl -sf -H "Content-Type: application/json" -X POST -d @discord_payload.json "$DISCORD_WEBHOOK"'
          }
        } catch (e) {
          echo "Aviso Discord salteado: ${e.message}"
        }
      }
      cleanWs()
    }
  }
}
