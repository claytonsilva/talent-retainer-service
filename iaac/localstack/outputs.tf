# this file is for output members

output "talent_queue_url" {
  value = "${aws_sqs_queue.talent.id}"
}

output "dynamo_talent_id" {
  value = "${aws_dynamodb_table.talent.id}"
}

output "opening_queue_url" {
  value = "${aws_sqs_queue.opening.id}"
}

output "dynamo_opening_id" {
  value = "${aws_dynamodb_table.opening.id}"
}

output "services_api_id" {
  value = "${aws_api_gateway_rest_api.main.id}"
}
