locals {
  # deploy
  user_deployer_name = "${var.project_name}-circleci-deployer"

  # talent
  dynamodb_table_name_talent = "talent"
  talent_topic_name          = "talents-matches"
  talent_queue_name          = "${local.dynamodb_table_name_talent}"

  talent_queue_retry_count        = "3"
  talent_queue_visibility_timeout = "30"
  talent_dlq_queue_name           = "${local.talent_queue_name}-dlq"

  # opening
  dynamodb_table_name_opening = "opening"
  opening_topic_name          = "openings-matches"
  opening_queue_name          = "${local.dynamodb_table_name_opening}"

  opening_queue_retry_count        = "3"
  opening_queue_visibility_timeout = "30"
  opening_dlq_queue_name           = "${local.opening_queue_name}-dlq"

  environent = {
    ###################################
    # GLOBAL AND DEBUG ENVS
    ###################################
    APP_NAME = "${var.project_name}"

    ENV_NAME = "development"
    TIMEZONE = "America/Sao_Paulo"

    ###################################
    # SPECIFIC OPTIONS
    ###################################
    WRITE_OPERATION_LEVEL = "ALL"

    ###################################
    # AWS SERVICES
    ###################################
    # DYNAMO
    AWS_DYNAMO_REGION = "${var.region}"

    AWS_DYNAMO_APIVERSION         = "${var.versions["DYNAMODB"]}"
    AWS_DYNAMO_TALENT_TABLE_NAME  = "${local.dynamodb_table_name_talent}"
    AWS_DYNAMO_OPENING_TABLE_NAME = "${local.dynamodb_table_name_opening}"
    AWS_DYNAMO_ENDPOINT           = "dynamodb.${var.region}.amazonaws.com"

    # SQS
    AWS_SQS_REGION                = "${var.region}"
    AWS_SQS_APIVERSION            = "${var.versions["SQS"]}"
    AWS_SQS_TALENT_QUEUE_URL      = "${aws_sqs_queue.talent.id}"
    AWS_SQS_TALENT_QUEUE_DLQ_URL  = "${aws_sqs_queue.talent_dlq.id}"
    AWS_SQS_OPENING_QUEUE_URL     = "${aws_sqs_queue.opening.id}"
    AWS_SQS_OPENING_QUEUE_DLQ_URL = "${aws_sqs_queue.opening_dlq.id}"

    # SNS
    AWS_SNS_REGION            = "${var.region}"
    AWS_SNS_APIVERSION        = "${var.versions["SNS"]}"
    AWS_SNS_ENDPOINT          = "sns.${var.region}.amazonaws.com"
    AWS_SNS_TALENT_TOPIC_ARN  = "${aws_sns_topic.talent_matches.arn}"
    AWS_SNS_OPENING_TOPIC_ARN = "${aws_sns_topic.opening_matches.arn}"
  }
}
