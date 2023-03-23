#! /usr/bin/env/ bash
rm -rf dist
npm run build
cd dist
echo leaf-vue.deng.gl > CNAME
git init
git add .
git commit -m deploy
git remote add origin git@github.com:Allengl/vue-leaf-preview.git
git branch -M master
git push -f origin master:master
cd -
