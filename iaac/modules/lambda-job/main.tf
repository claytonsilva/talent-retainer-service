resource "aws_iam_role" "lambda_job" {
  name = "role_lambda_${var.name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_job_repo" {
  policy_arn = "${aws_iam_policy.repo_lambda_ro.arn}"
  role       = "${aws_iam_role.lambda_job.name}"
}

resource "aws_lambda_function" "lambda_job" {
  s3_bucket = "${var.bucket_name_repo}"
  s3_key    = "${var.key_repo}"

  function_name = "${var.name}"
  role          = "${aws_iam_role.lambda_job.arn}"
  handler       = "${var.handler}"
  runtime       = "${var.runtime}"

  timeout = "${var.timeout}"

  environment = {
    variables = "${var.environment_var}"
  }

  publish = true

  lifecycle {
    ignore_changes = [
      "s3_key",
      "last_modified",
      "qualified_arn",
      "version",
    ]
  }
}

resource "aws_lambda_alias" "lambda_job_stable" {
  name             = "STABLE"
  description      = "Stable Version of the job"
  function_name    = "${aws_lambda_function.lambda_job.arn}"
  function_version = "$LATEST"

  depends_on = ["aws_lambda_function.lambda_job"]

  lifecycle = {
    ignore_changes = ["function_version"]
  }
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = "${aws_iam_role.lambda_job.name}"
  policy_arn = "${aws_iam_policy.lambda_job_logging.arn}"
}

######
# LOG GROUP AND PERMS
######

resource "aws_cloudwatch_log_group" "lambda_job" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 7
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
resource "aws_iam_policy" "lambda_job_logging" {
  name        = "lambda_job_logging_${var.name}"
  path        = "/"
  description = "IAM policy for logging from a lambda ${var.name} "

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}
