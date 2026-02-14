module "vpc" {
  source = "./modules/vpc"

  vpc_cidr    = var.vpc_cidr
  project_name = "orbitdesk"
  environment = var.environment
  aws_region  = var.aws_region
}

module "eks" {
  source = "./modules/eks"

  cluster_name    = "${var.cluster_name}-${var.environment}"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  
  node_group_name = "orbitdesk-workers"
  desired_size    = var.node_group_desired_size
  min_size        = var.node_group_min_size
  max_size        = var.node_group_max_size
  instance_types  = var.node_instance_types
}
