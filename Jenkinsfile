pipeline {
    agent any

    triggers {
        // Runs twice every 24 hours automatically on production
        cron('H H/12 * * *')
    }

    parameters {
        choice(
            name: 'APPENV',
            choices: ['prod', 'local', 'dev', 'preprod'],
            description: 'Select environment (manual runs only)'
        )
    }

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        APPENV = "${params.APPENV}"
        QA_ALERT_EMAILS = credentials('QA_ALERT_EMAILS')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
        skipDefaultCheckout()
        disableConcurrentBuilds()
    }

    stages {

        stage('Resolve Environment') {
            steps {
                script {
                    def isCronBuild = currentBuild.rawBuild
                        .getCause(hudson.triggers.TimerTrigger$TimerTriggerCause) != null

                    if (isCronBuild) {
                        env.APPENV = 'prod'
                        echo "Cron build detected → forcing APPENV=prod"
                    } else {
                        echo "Manual build → APPENV=${APPENV}"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    echo "Node version: $(node -v)"
                    echo "NPM version: $(npm -v)"

                    npm ci

                    echo "Installing Playwright browsers"
                    npx playwright install
                '''
            }
        }

        stage('Prepare Test Run') {
            steps {
                sh '''
                    rm -rf playwright-report test-results
                '''
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    try {
                        sh """
                            echo "Running Playwright tests in ${APPENV}"
                            export APPENV="${APPENV}"
                            npx playwright test
                        """
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        error("Playwright tests failed")
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh '''
                    if [ -d "playwright-report" ]; then
                        echo "Playwright report generated"
                    else
                        echo "No Playwright report found"
                    fi
                '''
            }
        }

        stage('Publish Results') {
            steps {
                archiveArtifacts(
                    artifacts: '''
                        playwright-report/**/*,
                        test-results/**/*,
                        videos/**/*.webm,
                        screenshots/**/*.png
                    ''',
                    allowEmptyArchive: true
                )

                publishHTML(
                    target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: "Playwright Test Report - ${APPENV}"
                    ]
                )
            }
        }
    }

    post {
        failure {
            script {
                def isCronBuild = currentBuild.rawBuild
                    .getCause(hudson.triggers.TimerTrigger$TimerTriggerCause) != null

                if (isCronBuild && APPENV == 'prod') {
                    emailext(
                        to: "${QA_ALERT_EMAILS}",
                        subject: "PROD Playwright Auto Test FAILED | ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
                            <h2>Production Auto Test Failure</h2>

                            <p><b>Environment:</b> PROD</p>
                            <p><b>Trigger:</b> Scheduled (Cron)</p>
                            <p><b>Job:</b> ${env.JOB_NAME}</p>
                            <p><b>Build:</b> #${env.BUILD_NUMBER}</p>

                            <p>
                              <a href="${env.BUILD_URL}">Jenkins Build</a><br/>
                              <a href="${env.BUILD_URL}Playwright_Test_Report_-_${APPENV}/">
                                  Playwright HTML Report
                              </a>
                            </p>
                        """,
                        mimeType: 'text/html'
                    )
                } else {
                    echo "Failure detected, but not a PROD cron build → no email sent"
                }
            }
        }

        success {
            echo 'Pipeline completed successfully'
        }

        always {
            cleanWs()
        }
    }
}
