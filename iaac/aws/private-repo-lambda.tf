#######################
# DEPLOY BUCKET FOR LAMBDA
#######################
module "s3" {
  source = "../modules/s3-private-repos"
  region = "${var.region}"
  prefix = "${var.project_name}"
}
