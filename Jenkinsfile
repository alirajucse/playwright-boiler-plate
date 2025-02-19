pipeline {
    agent any

    parameters {
        choice(
            name: 'APPENV',
            choices: ['local', 'dev', 'prod', 'preprod'],
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
                        
                        # Install dependencies
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
                            npx playwright test --project=${APPENV} || true
                        """
                    } catch (err) {
                        echo "Test execution completed with some failures: ${err}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                script {
                    sh '''
                        echo "Generating Playwright report"
                        npx playwright show-report || true
                    '''
                }
            }
        }

        stage('Publish Results') {
            steps {
                script {
                    // Archive test artifacts
                    archiveArtifacts(
                        artifacts: '''
                            playwright-report/**/*,
                            test-results/**/*,
                            videos/**/*.webm,
                            screenshots/**/*.png
                        ''',
                        allowEmptyArchive: true
                    )
                    
                    // Publish Playwright HTML report
                    publishHTML(
                        target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report/',
                            reportFiles: 'index.html',
                            reportName: "Playwright Test Report - ${APPENV}"
                        ]
                    )
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'All stages completed successfully!'
        }
        unstable {
            echo 'Test execution completed with some failures. Check the report for details.'
        }
        failure {
            echo 'Pipeline failed! Check the logs and report for details.'
        }
    }
}
