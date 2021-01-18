output "lambda_bucket" {
  value = "${aws_s3_bucket.lambda.id}"
}

output "lambda_bucket_arn" {
  value = "${aws_s3_bucket.lambda.arn}"
}

output "iam_lambda_policy_arn" {
  value = "${aws_iam_policy.lambda.arn}"
}

output "iam_lambda_policy_name" {
  value = "${aws_iam_policy.lambda.name}"
}
