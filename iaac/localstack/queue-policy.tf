data "template_file" "queue_retry_policy_talent" {
  template = "${file("${path.module}/queue-policy.json")}"

  vars = {
    dead_letter_arn = "${aws_sqs_queue.opening.arn}"
    retry_count     = "${local.talent_queue_retry_count}"
  }
}

data "template_file" "queue_retry_policy_opening" {
  template = "${file("${path.module}/queue-policy.json")}"

  vars = {
    dead_letter_arn = "${aws_sqs_queue.opening_dlq.arn}"
    retry_count     = "${local.talent_queue_retry_count}"
  }
}
