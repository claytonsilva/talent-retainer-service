# this file is for output members

output "talent_queue_url" {
  value = "${aws_sqs_queue.talent.id}"
}

output "talent_sns_topic_arn" {
  value = "${aws_sns_topic.talent_matches.arn}"
}

output "dynamo_talent_id" {
  value = "${aws_dynamodb_table.talent.id}"
}

output "opening_queue_url" {
  value = "${aws_sqs_queue.opening.id}"
}

output "opening_sns_topic_arn" {
  value = "${aws_sns_topic.opening_matches.arn}"
}

output "dynamo_opening_id" {
  value = "${aws_dynamodb_table.opening.id}"
}

output "services_api_id" {
  value = "${aws_api_gateway_rest_api.main.id}"
}

output "api_key" {
  value = "${aws_api_gateway_api_key.developer.value}"
}

output "lambda_s3_repo_name" {
  value = "${module.s3.lambda_bucket}"
}

output "deployer_key" {
  value = "${module.user_deployer.key}"
}

output "deployer_secret_key" {
  value = "${module.user_deployer.secret_key}"
}
