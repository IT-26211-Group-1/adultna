#!/bin/bash

# Script to fix Cache-Control headers for static assets in S3
# This ensures proper caching for images, CSS, and JS files

BUCKET="adultna"

echo "Fixing Cache-Control headers for static assets in s3://$BUCKET"

# Function to update files with proper content-type detection
update_files() {
  local pattern=$1
  local cache_control=$2
  local content_type=$3

  echo "Updating $pattern files..."

  aws s3 ls s3://$BUCKET/ --recursive | grep "$pattern" | awk '{print $4}' | while read key; do
    aws s3 cp "s3://$BUCKET/$key" "s3://$BUCKET/$key" \
      --metadata-directive REPLACE \
      --cache-control "$cache_control" \
      --content-type "$content_type" \
      --quiet
  done
}

# Update PNG images
update_files "\.png$" "public,max-age=31536000,immutable" "image/png"

# Update JPG images
update_files "\.jpg$" "public,max-age=31536000,immutable" "image/jpeg"
update_files "\.jpeg$" "public,max-age=31536000,immutable" "image/jpeg"

# Update SVG images
update_files "\.svg$" "public,max-age=31536000,immutable" "image/svg+xml"

# Update WebP images
update_files "\.webp$" "public,max-age=31536000,immutable" "image/webp"

# Update CSS files
update_files "\.css$" "public,max-age=31536000,immutable" "text/css"

# Update JS files
update_files "\.js$" "public,max-age=31536000,immutable" "application/javascript"

# Update HTML files (keep short cache)
update_files "\.html$" "public,max-age=0,must-revalidate" "text/html"

echo "Done! Cache headers updated."
echo ""
echo "Next steps:"
echo "1. Get your CloudFront distribution ID:"
echo "   aws ssm get-parameter --name /adultna/frontend/distribution-id --query 'Parameter.Value' --output text"
echo "2. Create invalidation:"
echo "   aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths '/*'"
