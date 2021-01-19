resource "aws_iam_user" "deployer" {
  name = "${var.name}"
}

resource "aws_iam_access_key" "deployer" {
  user = "${aws_iam_user.deployer.name}"
}
