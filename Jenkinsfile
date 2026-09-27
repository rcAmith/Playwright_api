pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        booleanParam(
            name: 'DOCKER_RUN',
            defaultValue: true,
            description: 'Run tests inside Docker'
        )
    }

    environment {
        CI = 'true'
        API_BASE_URL = 'https://dummyjson.com'
        LOG_LEVEL = 'info'

        API_USERNAME = credentials('api-username')
        API_PASSWORD = credentials('api-password')

        DOCKER_IMAGE = "playwright-api-tests:${BUILD_NUMBER}"
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
                    !params.DOCKER_RUN
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
                            docker build \
                                -t "$DOCKER_IMAGE" \
                                .

                            docker run --rm \
                                -e CI=true \
                                -e API_BASE_URL="$API_BASE_URL" \
                                -e LOG_LEVEL="$LOG_LEVEL" \
                                -e API_USERNAME="$API_USERNAME" \
                                -e API_PASSWORD="$API_PASSWORD" \
                                -v "$PWD/test-results:/app/test-results" \
                                -v "$PWD/playwright-report:/app/playwright-report" \
                                "$DOCKER_IMAGE"
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