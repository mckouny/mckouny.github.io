import re
import hashlib
from os import urandom

salt = urandom(32)
known_commands = ["alias", "apt-get", "aptitude", "aspell", "awk", "gawk", "basename", "base32", "base64", "bc", "bg", "bind", "break", "builtin", "bzip", "cal", "case", "cat", "cd", "cfdisk", "chattr", "chgrp", "chmod", "chown", "chpasswd", "chroot", "chkconfig", "cksum", "cmp", "comm", "command", "continue", "cp", "cpio", "cron", "crontab", "csplit", "curl", "cut", "date", "dc", "dd", "ddrescue", "declare", "df", "diff", "diff3", "dig", "dir", "dircolors", "dirname", "dirs", "dmesg", "du", "echo", "egrep", "eject", "enable", "env", "eval", "exec", "exit", "expand", "export", "expr", "false", "fdformat", "fdisk", "fg", "fgrep", "file", "find", "fmt", "fold", "for", "fsck", "FTP", "fuser", "getopts", "grep", "groupadd", "groupdel", "groupmod", "groups", "gzip", "hash", "head", "history", "hostname", "htop", "iconv", "id", "if", "ifconfig", "ifup", "ifdown", "import", "install", "iostat", "ip", "jobs", "join", "kill", "killall", "less", "let", "link", "ln", "local", "locate", "logname", "logout", "look", "lpc", "lpr", "lprm", "lsattr", "lsblk", "ls", "lsof", "lspci", "man", "info", "help", "mkdir", "mkfifo", "mkfile", "mknod", "mktemp", "more", "most", "mount", "mtools", "mtr", "mv", "mmv", "nc", "netcat", "netstat", "nft", "nice", "nl", "nohup", "notify-send", "nslookup", "open", "op", "passwd", "paste", "perf", "ping", "pgrep", "pkill", "popd", "pr", "printenv", "printf", "ps", "pushd", "pv", "pwd", "quota", "quotacheck", "ram", "rar", "rcp", "read", "readonly", "rename", "return", "rev", "rm", "rmdir", "screen", "scp", "sdiff", "sed", "select", "seq", "set", "shift", "shopt", "shutdown", "sleep", "slocate", "sort", "split", "ss", "ssh", "stat", "strace", "su", "sudo", "sum", "suspend", "sync", "tail", "tar", "tee", "test", "time", "timeout ", "times", "touch", "top", "tput", "traceroute", "trap", "tr", "true", "tsort", "tty", "type", "ulimit", "umask", "uname", "unexpand", "uniq", "units", "unrar", "unset", "unshar", "until", "useradd", "userdel", "usermod", "users", "uuencode", "uudecode", "vmstat ", "w", "wait ", "watch", "wc", "whereis", "which", "while", "who", "whoami", "write", "xargs", "xdg-open", "xz", "yes", "zip", "yum", "tree", "rpm", "git", "nano", "python", "last", "&", "&&", "(", ")", ";", ";;", "|", "||", "<", ">", ">|", "<<", ">>", "<&", ">&", "<<-", "<>"] 

with open("~/.bash_history", "r") as f:
    with open("exampleoutput.txt", "w+") as output:
        for line in f:
            line = line.split()

            for word in line:
                word = word.lower()
                if word in known_commands: #finding commands from list + operators
                    output.write(word + " ")
                
                elif re.match(r"^-\w{1,4}$", word): #matching single dash flags (max 4 characters)
                    output.write(word + " ")

                elif re.match(r"^-(-\w{1,10}){1,4}$", word): #matching double dash flags
                    output.write(word + " ")

                else:
                    hashed = hashlib.pbkdf2_hmac('sha256', word.encode('utf-8'), salt, 10000, dklen=32)
                    output.write(str(hashed) + " ")   

            output.write("\n")
