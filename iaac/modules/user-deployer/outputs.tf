output "key" {
  value = "${aws_iam_access_key.deployer.id}"
}

output "secret_key" {
  value = "${aws_iam_access_key.deployer.secret}"
}

output "arn" {
  value = "${aws_iam_user.deployer.arn}"
}

output "name" {
  value = "${aws_iam_user.deployer.name}"
}

output "unique_id" {
  value = "${aws_iam_user.deployer.unique_id}"
}
