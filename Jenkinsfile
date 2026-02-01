pipeline {
    agent any

    triggers {
        // Two automatic builds every 24 hours
        cron('H H/12 * * *')
    }

    parameters {
        choice(
            name: 'APPENV',
            choices: ['prod', 'local', 'dev', 'preprod'],
            description: 'Select the environment to run tests against'
        )
    }
    
    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        APPENV = "${params.APPENV}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        ansiColor('xterm')
        skipDefaultCheckout()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                script {
                    echo "Setting up environment: ${APPENV}"
                    sh '''
                        echo "Node version: $(node -v)"
                        echo "NPM version: $(npm -v)"
                        npm ci
                    '''
                }
            }
        }

        stage('Prepare Test Run') {
            steps {
                script {
                    sh '''
                        echo "Cleaning previous reports"
                        rm -rf playwright-report test-results
                    '''
                }
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    try {
                        sh """
                            echo "Running Playwright tests in environment: ${APPENV}"
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
                script {
                    sh '''
                        echo "Generating Playwright report"
                        if [ -d "playwright-report" ]; then
                            echo "Playwright report found."
                        else
                            echo "No Playwright report found."
                        fi
                    '''
                }
            }
        }
    
        stage('Publish Results') {
            steps {
                script {
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
    }

    post {
        failure {
            script {
                // Detect cron-triggered build
                def isCronBuild = currentBuild.rawBuild
                    .getCause(hudson.triggers.TimerTrigger$TimerTriggerCause) != null

                if (isCronBuild && APPENV == 'prod') {
                    emailext(
                        subject: "PROD Auto Playwright Failed | ${env.JOB_NAME} #${env.BUILD_NUMBER}",
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
                        to: "your-email@gmail.com"
                    )
                } else {
                    echo "Failure detected, but not a cron-triggered PROD build. No email sent."
                }
            }
        }

        success {
            echo 'All stages completed successfully!'
        }

        always {
            cleanWs()
        }
    }
}
