data "template_file" "policy_s3_lambda" {
  template = "${file("${path.module}/s3policy.json.tpl")}"

  vars {
    id = "${aws_s3_bucket.lambda.id}"
  }
}

resource "aws_iam_policy" "lambda" {
  name        = "${var.prefix}-lambda-repo-access"
  path        = "/"
  description = "Lambda repos. for ${var.prefix}"
  policy      = "${data.template_file.policy_s3_lambda.rendered}"
}
