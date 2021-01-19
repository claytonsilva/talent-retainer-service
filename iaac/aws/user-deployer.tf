data "aws_iam_policy_document" "policydocument" {
  statement {
    sid = "DeployLambda"

    actions = [
      "lambda:UpdateFunctionCode",
      "lambda:PublishVersion",
      "lambda:UpdateAlias",
    ]

    resources = [
      "${module.job_sns_printer.lambda_job_arn}",
      "${module.job_openings_service.lambda_job_arn}",
      "${module.job_openings_worker.lambda_job_arn}",
      "${module.job_talents_service.lambda_job_arn}",
      "${module.job_talents_worker.lambda_job_arn}",
    ]
  }

  statement {
    sid = "ManageRepositoryContents"

    actions = [
      "s3:ReplicateObject",
      "s3:PutObject",
      "s3:PutAccelerateConfiguration",
      "s3:AbortMultipartUpload",
      "s3:PutObjectRetention",
      "s3:DeleteObjectVersion",
      "s3:RestoreObject",
      "s3:PutObjectLegalHold",
      "s3:CreateJob",
      "s3:DeleteObject",
      "s3:DeleteBucket",
      "s3:ReplicateDelete",
    ]

    resources = [
      "${module.s3.lambda_bucket_arn}",
      "${module.s3.lambda_bucket_arn}/*",
    ]
  }
}

module "user_deployer" {
  source = "../modules/user-deployer"
  name   = "${local.user_deployer_name}"
}

resource "aws_iam_policy" "deployer" {
  name        = "${local.user_deployer_name}"
  description = "Deploy Circle CI Policy ${local.user_deployer_name}"
  policy      = "${data.aws_iam_policy_document.policydocument.json}"

  depends_on = [
    "data.aws_iam_policy_document.policydocument",
  ]
}

resource "aws_iam_user_policy" "deployer" {
  name   = "${local.user_deployer_name}-policy"
  user   = "${module.user_deployer.name}"
  policy = "${aws_iam_policy.deployer.policy}"
}
