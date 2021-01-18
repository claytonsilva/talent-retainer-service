data "template_file" "policy_s3_ro" {
  template = "${file("${path.module}/s3policy-read-only.json")}"

  vars {
    bucket_name = "${var.bucket_name_repo}"
  }
}

resource "aws_iam_policy" "repo_lambda_ro" {
  name        = "control_ro_lambda_${var.name}"
  path        = "/"
  description = "read only control from source repo to ${var.name}"
  policy      = "${data.template_file.policy_s3_ro.rendered}"
}
