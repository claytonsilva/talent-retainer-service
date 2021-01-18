resource "aws_lambda_event_source_mapping" "from_talent_sqs" {
  enabled          = true
  event_source_arn = "${aws_sqs_queue.talent.arn}"
  function_name    = "${module.job_talents_worker.lambda_job_arn}"

  depends_on = [
    "aws_iam_role_policy.job_talents_service",
    "aws_iam_role_policy.job_talents_worker",
  ]
}

resource "aws_lambda_event_source_mapping" "from_opening_sqs" {
  enabled          = true
  event_source_arn = "${aws_sqs_queue.opening.arn}"
  function_name    = "${module.job_openings_worker.lambda_job_arn}"

  depends_on = [
    "aws_iam_role_policy.job_openings_service",
    "aws_iam_role_policy.job_openings_worker",
  ]
}

resource "aws_sns_topic_subscription" "from_event_talents_match" {
  topic_arn = "${aws_sns_topic.talent_matches.arn}"
  protocol  = "lambda"
  endpoint  = "${module.job_sns_printer.lambda_job_arn}"

  depends_on = [
    "aws_iam_role_policy.job_talents_service",
    "aws_iam_role_policy.job_talents_worker",
  ]
}

resource "aws_sns_topic_subscription" "from_event_openings_match" {
  topic_arn = "${aws_sns_topic.opening_matches.arn}"
  protocol  = "lambda"
  endpoint  = "${module.job_sns_printer.lambda_job_arn}"

  depends_on = [
    "aws_iam_role_policy.job_openings_service",
    "aws_iam_role_policy.job_openings_worker",
  ]
}
