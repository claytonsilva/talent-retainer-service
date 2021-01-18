resource "aws_lambda_event_source_mapping" "from_talent_sqs" {
  enabled          = true
  event_source_arn = "${aws_sqs_queue.talent.arn}"
  function_name    = "${aws_lambda_function.talents_worker.arn}"
}

resource "aws_lambda_event_source_mapping" "from_opening_sqs" {
  enabled          = true
  event_source_arn = "${aws_sqs_queue.opening.arn}"
  function_name    = "${aws_lambda_function.openings_worker.arn}"
}

resource "aws_sns_topic_subscription" "from_event_talents_match" {
  topic_arn = "${aws_sns_topic.talent_matches.arn}"
  protocol  = "lambda"
  endpoint  = "${aws_lambda_function.sns_printer.arn}"
}

resource "aws_sns_topic_subscription" "from_event_openings_match" {
  topic_arn = "${aws_sns_topic.opening_matches.arn}"
  protocol  = "lambda"
  endpoint  = "${aws_lambda_function.sns_printer.arn}"
}
