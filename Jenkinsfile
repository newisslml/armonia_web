// Copiar como "Jenkinsfile" a la raiz del repo (funciona para ramas/PRs que
// traigan solo backend/, solo frontend/, o ambos — detecta que hay y corre
// solo lo que aplica)
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
          env.HAS_BACKEND = fileExists('backend/package.json') ? 'true' : 'false'
          env.HAS_FRONTEND = fileExists('frontend/package.json') ? 'true' : 'false'
          echo "backend/package.json: ${env.HAS_BACKEND} | frontend/package.json: ${env.HAS_FRONTEND}"
        }
      }
    }

    stage('Backend: install') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        dir('backend') {
          sh 'pnpm install --frozen-lockfile'
        }
      }
    }

    stage('Backend: prisma') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        dir('backend') {
          sh 'pnpm exec prisma generate'
          sh 'pnpm exec prisma migrate deploy'
        }
      }
    }

    stage('Backend: lint') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        dir('backend') {
          sh 'pnpm exec eslint . --max-warnings=0'
        }
      }
    }

    stage('Backend: format check') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        dir('backend') {
          sh 'pnpm exec prettier --check .'
        }
      }
    }

    stage('Backend: tests + coverage') {
      when { environment name: 'HAS_BACKEND', value: 'true' }
      steps {
        dir('backend') {
          sh 'pnpm exec vitest run --coverage'
        }
      }
    }

    stage('Frontend: install') {
      when { environment name: 'HAS_FRONTEND', value: 'true' }
      steps {
        dir('frontend') {
          sh 'pnpm install --frozen-lockfile'
        }
      }
    }

    stage('Frontend: tests + coverage') {
      when { environment name: 'HAS_FRONTEND', value: 'true' }
      steps {
        dir('frontend') {
          sh 'pnpm exec vitest run --coverage'
        }
      }
    }

    stage('Security: secrets (gitleaks)') {
      steps {
        sh 'gitleaks detect --source . --no-git -v'
      }
    }

    stage('Security: SAST (semgrep)') {
      steps {
        script {
          def paths = []
          if (env.HAS_BACKEND == 'true' || fileExists('backend')) { paths << 'backend' }
          if (fileExists('frontend')) { paths << 'frontend' }
          if (paths.isEmpty()) { paths << '.' }
          // auto = reglas OWASP genericas; handbook.yml = reglas propias del handbook
          sh "semgrep --config auto --config .semgrep/handbook.yml --error ${paths.join(' ')}"
        }
      }
    }
  }

  post {
    always {
      script {
        def status = currentBuild.currentResult // SUCCESS, FAILURE, UNSTABLE
        def color = status == 'SUCCESS' ? 3066993 : 15158332 // verde / rojo
        def prUrl = env.CHANGE_URL ?: env.BUILD_URL
        def title = env.CHANGE_ID ? "PR #${env.CHANGE_ID}: ${env.CHANGE_TITLE}" : "Build ${env.BRANCH_NAME ?: ''} #${env.BUILD_NUMBER}"
        def payload = groovy.json.JsonOutput.toJson([
          embeds: [[
            title: "${status} - ${title}",
            url: prUrl,
            color: color,
            fields: [
              [name: 'Branch', value: "${env.BRANCH_NAME ?: '-'}", inline: true],
              [name: 'Build', value: "#${env.BUILD_NUMBER}", inline: true],
              [name: 'Duracion', value: "${currentBuild.durationString}", inline: true]
            ]
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
