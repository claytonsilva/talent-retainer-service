variable "region" {
  default = "us-east-1"
}

variable "project_name" {
  type = "string"

  default = "talent-retainer-service"
}

variable "runtime" {
  type    = "string"
  default = "nodejs12.x"
}

variable "versions" {
  type = "map"

  default = {
    SQS      = "2012-11-05"
    S3       = "2006-03-01"
    DYNAMODB = "2012-08-10"
    SNS      = "2010-03-31"
  }
}

variable "environment" {
  type = "string"

  default = "development"
}
