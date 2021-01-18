locals {
  # talent
  dynamodb_table_name_talent = "talent"
  talent_topic_name          = "talents-matches"
  talent_queue_name          = "${local.dynamodb_table_name_talent}"

  talent_queue_retry_count        = "3"
  talent_queue_visibility_timeout = "10"
  talent_dlq_queue_name           = "${local.talent_queue_name}-dlq"

  # opening
  dynamodb_table_name_opening = "opening"
  opening_topic_name          = "openings-matches"
  opening_queue_name          = "${local.dynamodb_table_name_opening}"

  opening_queue_retry_count        = "3"
  opening_queue_visibility_timeout = "10"
  opening_dlq_queue_name           = "${local.opening_queue_name}-dlq"

  localstack_remote_endpoint = "http://localstack_${var.project_name}:4566"

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
    AWS_DYNAMO_ENDPOINT           = "${local.localstack_remote_endpoint}"

    # SQS
    AWS_SQS_REGION                = "${var.region}"
    AWS_SQS_APIVERSION            = "${var.versions["SQS"]}"
    AWS_SQS_TALENT_QUEUE_URL      = "${local.localstack_remote_endpoint}/000000000000/${local.talent_queue_name}"
    AWS_SQS_TALENT_QUEUE_DLQ_URL  = "${local.localstack_remote_endpoint}/000000000000/${local.talent_dlq_queue_name}"
    AWS_SQS_OPENING_QUEUE_URL     = "${local.localstack_remote_endpoint}/000000000000/${local.opening_queue_name}"
    AWS_SQS_OPENING_QUEUE_DLQ_URL = "${local.localstack_remote_endpoint}/000000000000/${local.opening_dlq_queue_name}"

    # SNS
    AWS_SNS_REGION            = "${var.region}"
    AWS_SNS_APIVERSION        = "${var.versions["SNS"]}"
    AWS_SNS_ENDPOINT          = "${local.localstack_remote_endpoint}"
    AWS_SNS_TALENT_TOPIC_ARN  = "arn:aws:sns:${var.region}:000000000000:${local.talent_topic_name}"
    AWS_SNS_OPENING_TOPIC_ARN = "arn:aws:sns:${var.region}:000000000000:${local.opening_topic_name}"
  }
}
