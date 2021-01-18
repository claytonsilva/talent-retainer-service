resource "aws_s3_bucket" "lambda" {
  bucket = "${var.prefix}-lambda-repository"
  acl    = "private"

  # lifecycle_rule {
  #   id      = "versions"
  #   enabled = true

  #   prefix = "/"

  #   tags {
  #     "rule"      = "backups"
  #     "autoclean" = "true"
  #   }

  #   transition {
  #     days          = 30
  #     storage_class = "STANDARD_IA"
  #   }

  #   transition {
  #     days          = 60
  #     storage_class = "GLACIER"
  #   }

  #   expiration {
  #     days = 90
  #   }
  # }
}
