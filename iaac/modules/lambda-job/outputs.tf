output "lambda_job_arn" {
  value = "${aws_lambda_function.lambda_job.arn}"
}

output "lambda_job_name" {
  value = "${aws_lambda_function.lambda_job.function_name}"
}

output "lambda_job_role_name" {
  value = "${aws_iam_role.lambda_job.name}"
}

output "lambda_job_role_arn" {
  value = "${aws_iam_role.lambda_job.arn}"
}

output "lambda_job_invoke_arn" {
  value = "${aws_lambda_function.lambda_job.invoke_arn}"
}
