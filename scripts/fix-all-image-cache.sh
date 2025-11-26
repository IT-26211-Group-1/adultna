#!/bin/bash
BUCKET="adultna"

echo "Updating all PNG images..."
aws s3 ls s3://$BUCKET/ --recursive | grep "\.png$" | awk '{print $4}' | while read key; do
  aws s3 cp "s3://$BUCKET/$key" "s3://$BUCKET/$key" \
    --metadata-directive REPLACE \
    --cache-control "public,max-age=31536000,immutable" \
    --content-type "image/png" --quiet
  echo "Updated: $key"
done

echo "Updating all SVG images..."
aws s3 ls s3://$BUCKET/ --recursive | grep "\.svg$" | awk '{print $4}' | while read key; do
  aws s3 cp "s3://$BUCKET/$key" "s3://$BUCKET/$key" \
    --metadata-directive REPLACE \
    --cache-control "public,max-age=31536000,immutable" \
    --content-type "image/svg+xml" --quiet
  echo "Updated: $key"
done

echo "Done!"
