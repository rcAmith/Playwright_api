pipeline {

    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'staging'],
            description: 'Environment to run API tests against'
        )

        booleanParam(
            name: 'DOCKER_RUN',
            defaultValue: false,
            description: 'Run tests inside Docker'
        )
    }

    environment {
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            when {
                expression {
                    return !params.DOCKER_RUN
                }
            }

            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run API Tests') {
            steps {
                script {

                    if (params.DOCKER_RUN) {

                        sh """
                            docker build -t playwright-api-tests .
                            docker run --rm \
                                -e ENVIRONMENT=${params.ENVIRONMENT} \
                                -v "\$PWD/test-results:/app/test-results" \
                                -v "\$PWD/playwright-report:/app/playwright-report" \
                                playwright-api-tests
                        """

                    } else {

                        sh """
                            ENVIRONMENT=${params.ENVIRONMENT} \
                            npx playwright test
                        """
                    }
                }
            }
        }
    }

    post {

        always {

            junit(
                testResults: 'test-results/*.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'playwright-report/**, test-results/**',
                allowEmptyArchive: true
            )

            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }

        success {
            echo 'API tests completed successfully.'
        }

        failure {
            echo 'API tests failed. Check the Playwright report.'
        }
    }
}