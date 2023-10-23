echo "Building screenshot image..."
$Hash = (docker build -f devops/screenshots.dockerfile -q .) -split "sha256:" | select -last 1
echo "Image hash: $Hash"
docker run --rm -it -v "${pwd}/apps/web/e2e:/work/apps/web/e2e" $Hash