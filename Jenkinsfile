pipeline {
    agent any

    triggers {
        // Run twice every 24 hours (production only)
        cron('H H/12 * * *')
    }

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        APPENV = 'prod'
        CI = 'true'
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    stages {

        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node version: $(node -v)"
                    echo "NPM version: $(npm -v)"
                    npm ci
                '''
            }
        }

        stage('Prepare Workspace') {
            steps {
                sh '''
                    echo "Cleaning previous test artifacts"
                    rm -rf playwright-report test-results
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    try {
                        sh """
                            echo "Running Playwright tests in PRODUCTION environment"
                            export APPENV=prod
                            npx playwright test --reporter=html
                        """
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        error("Playwright test failures detected")
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                archiveArtifacts(
                    artifacts: '''
                        playwright-report/**/*,
                        test-results/**/*,
                        **/*.png,
                        **/*.webm
                    ''',
                    allowEmptyArchive: true
                )

                publishHTML(
                    target: [
                        allowMissing: true,
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report (PROD)'
                    ]
                )
            }
        }
    }

    post {

        failure {
            emailext(
                subject: "PROD Playwright FAILED | ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>Production Test Failure</h2>
                    <p><b>Environment:</b> PROD</p>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                    <p>
                        <a href="${env.BUILD_URL}">Jenkins Build</a><br/>
                        <a href="${env.BUILD_URL}Playwright_Test_Report_(PROD)/">
                            Playwright HTML Report
                        </a>
                    </p>
                """,
                to: "alirajujnu11@gmail.com"
            )
        }

        success {
            echo "Production Playwright tests passed"
        }

        always {
            echo "Cleaning workspace"
            cleanWs()
        }
    }
}
