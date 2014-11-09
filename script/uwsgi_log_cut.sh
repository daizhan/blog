#! /bin/bash
# 切割uwsgi 日志脚本, 有可能导致切割时间点的日志丢失

# uwsgi 日志存放路径
logs_path="/home/daizhan/Projects/personal/blog/log/uwsgi/"
mv ${logs_path}access.log ${logs_path}access_$(date +%Y%m%d%H%M).log
sudo kill -HUP `cat /home/daizhan/Projects/personal/blog/uwsgi.pid`
echo mv ${logs_path}access.log to ${logs_path}access_$(date +%Y%m%d%H%M).log
