pipeline {

    agent any

    parameters {
        booleanParam(
            name: 'DOCKER_RUN',
            defaultValue: false,
            description: 'Run tests inside Docker'
        )
    }

    environment {
        CI = 'true'
        API_BASE_URL = 'https://dummyjson.com'
        LOG_LEVEL = 'info'

        API_USERNAME = credentials('api-username')
        API_PASSWORD = credentials('api-password')
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
            }
        }

        stage('Run API Tests') {
            steps {
                script {

                    if (params.DOCKER_RUN) {

                        sh '''
                            docker build -t playwright-api-tests .
                            docker run --rm \
                                -e CI=true \
                                -e API_BASE_URL="$API_BASE_URL" \
                                -e LOG_LEVEL="$LOG_LEVEL" \
                                -e API_USERNAME="$API_USERNAME" \
                                -e API_PASSWORD="$API_PASSWORD" \
                                -v "$PWD/test-results:/app/test-results" \
                                -v "$PWD/playwright-report:/app/playwright-report" \
                                playwright-api-tests
                        '''

                    } else {

                        sh 'npm test'
                    }
                }
            }
        }
    }

    post {

        always {

            junit(
                testResults: 'test-results/results.xml',
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