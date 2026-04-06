pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = "${AWS_ACCESS_KEY}"
        AWS_SECRET_ACCESS_KEY = "${AWS_SECRET_KEY}"
        AWS_DEFAULT_REGION = "${AWS_REGION}"
        S3_BUCKET = "${AWS_BUCKET_NAME}"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
                sh 'npm run export'
            }
        }

        stage('Deploy to S3') {
            steps {
                sh '''
                aws s3 sync ./out/ s3://$S3_BUCKET/ \
                  --delete \
                  --region $AWS_DEFAULT_REGION
                '''
            }
        }
    }
}