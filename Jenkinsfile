pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'eduflow-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/Akshay269/EduFlow-Frontend-Code'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-s3-creds'
                ]]) {
                    sh '''
                    aws s3 sync ./out s3://$S3_BUCKET/ \
                        --delete \
                        --region $AWS_REGION
                    '''
                }
            }
        }
    }
}