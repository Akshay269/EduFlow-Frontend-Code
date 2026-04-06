pipeline {
    agent any

 environment {
    S3_BUCKET = 'eduflow-frontend'
    AWS_DEFAULT_REGION = 'ap-south-1'
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