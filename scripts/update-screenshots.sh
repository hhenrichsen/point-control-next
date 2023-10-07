echo "Building screenshot image..."
Hash="$(docker build -f devops/screenshots.dockerfile -q . | cut -d: -f2)"
echo "Image hash: $Hash"
docker run --rm -it -v "./apps/web/e2e:/work/apps/web/e2e" "$Hash"