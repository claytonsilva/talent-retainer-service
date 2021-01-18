variable "name" {
  description = "name of job registered "
}

variable "bucket_name_repo" {}

variable "key_repo" {}

variable "handler" {}

variable "runtime" {
  default = "nodejs12.x"
}

variable "timeout" {
  default = 120
}

variable "environment_var" {
  type    = "map"
  default = {}
}
