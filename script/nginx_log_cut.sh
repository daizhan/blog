#! /bin/bash
# 切割nginx 日志脚本

# nginx 日志存放路径
logs_path="/home/daizhan/Projects/personal/blog/log/nginx/"
mv ${logs_path}access.log ${logs_path}access_$(date +%Y%m%d%H%M).log
kill -USR1 `cat /home/daizhan/Projects/personal/blog/nginx.pid`
echo mv ${logs_path}access.log to ${logs_path}access_$(date +%Y%m%d%H%M).log
