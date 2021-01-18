resource "aws_dynamodb_table" "talent" {
  name           = "${local.dynamodb_table_name_talent}"
  read_capacity  = 5
  write_capacity = 1
  hash_key       = "talentEconomicSegment"
  range_key      = "id"

  attribute {
    name = "talentEconomicSegment"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_sns_topic" "talent_matches" {
  name = "${local.talent_topic_name}"

  delivery_policy = <<EOF
{
  "http": {
    "defaultHealthyRetryPolicy": {
      "minDelayTarget": 20,
      "maxDelayTarget": 20,
      "numRetries": 3,
      "numMaxDelayRetries": 0,
      "numNoDelayRetries": 0,
      "numMinDelayRetries": 0,
      "backoffFunction": "linear"
    },
    "disableSubscriptionOverrides": false,
    "defaultThrottlePolicy": {
      "maxReceivesPerSecond": 1
    }
  }
}
EOF
}

resource "aws_sqs_queue" "talent" {
  name                       = "${local.talent_queue_name}"
  max_message_size           = 8192
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 10
  visibility_timeout_seconds = "${local.talent_queue_visibility_timeout}"

  redrive_policy = "${data.template_file.queue_retry_policy_talent.rendered}"

  lifecycle {
    ignore_changes = ["redrive_policy"]
  }
}

resource "aws_sqs_queue" "talent_dlq" {
  name                       = "${local.talent_dlq_queue_name}"
  max_message_size           = 8192
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 10
  visibility_timeout_seconds = "${local.talent_queue_visibility_timeout}"
}

resource "aws_dynamodb_table" "opening" {
  name           = "${local.dynamodb_table_name_opening}"
  read_capacity  = 5
  write_capacity = 1
  hash_key       = "openingEconomicSegment"
  range_key      = "id"

  attribute {
    name = "openingEconomicSegment"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_sns_topic" "opening_matches" {
  name = "${local.opening_topic_name}"

  delivery_policy = <<EOF
  {
    "http": {
      "defaultHealthyRetryPolicy": {
        "minDelayTarget": 20,
        "maxDelayTarget": 20,
        "numRetries": 3,
        "numMaxDelayRetries": 0,
        "numNoDelayRetries": 0,
        "numMinDelayRetries": 0,
        "backoffFunction": "linear"
      },
      "disableSubscriptionOverrides": false,
      "defaultThrottlePolicy": {
        "maxReceivesPerSecond": 1
      }
    }
  }
  EOF
}

resource "aws_sqs_queue" "opening" {
  name                       = "${local.opening_queue_name}"
  max_message_size           = 8192
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 10
  visibility_timeout_seconds = "${local.opening_queue_visibility_timeout}"

  redrive_policy = "${data.template_file.queue_retry_policy_opening.rendered}"

  lifecycle {
    ignore_changes = ["redrive_policy"]
  }
}

resource "aws_sqs_queue" "opening_dlq" {
  name                       = "${local.opening_dlq_queue_name}"
  max_message_size           = 8192
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 10
  visibility_timeout_seconds = "${local.opening_queue_visibility_timeout}"
}
