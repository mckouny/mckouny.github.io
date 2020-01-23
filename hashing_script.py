#!/usr/bin/env python3
"""
Shell history anonymizing script, part of a dissertation project -
mckouny.github.io.

Usage options: 
1)  Pipe your bash/zsh history into the script and redirect the output to a file.
    $: history | python hashing_script.py > /output/file
    
2)  Using .bash_history files (usually located in your home folder)
    $: cat file1 (file2) | python hashing_script.py > /output/file

Please contact me, Antonin Kanat (antonin.kanat.17@ucl.ac.uk) with any queries.

IMPORTANT: If you have multiple files from the same user, PROCESS THEM ALL AT
ONCE by catting them (cat file1 ... filex) before passing to the script.
A new salt is generated each time the script is run, producing different
hashes for the same input. This would significantly reduce  my ability to observe
patters.
"""

import base64
import re
import hashlib
from os import urandom
import sys
import shlex

salt = urandom(32)
known_commands = ["alias", "apt-get", "aptitude", "aspell", "awk", "gawk", "basename", "base32", "base64", "bc", "bg", "bind", "break", "builtin", "bzip", "cal", "case", "cat", "cd", "cfdisk", "chattr", "chgrp", "chmod", "chown", "chpasswd", "chroot", "chkconfig", "cksum", "cmp", "comm", "command", "continue", "cp", "cpio", "cron", "crontab", "csplit", "curl", "cut", "date", "dc", "dd", "ddrescue", "declare", "df", "diff", "diff3", "dig", "dir", "dircolors", "dirname", "dirs", "dmesg", "du", "echo", "egrep", "eject", "enable", "env", "eval", "exec", "exit", "expand", "export", "expr", "false", "fdformat", "fdisk", "fg", "fgrep", "file", "find", "fmt", "fold", "for", "fsck", "FTP", "fuser", "getopts", "grep", "groupadd", "groupdel", "groupmod", "groups", "gzip", "hash", "head", "history", "hostname", "htop", "iconv", "id", "if", "ifconfig", "ifup", "ifdown", "import", "install", "iostat", "ip", "jobs", "join", "kill", "killall", "less", "let", "link", "ln", "local", "locate", "logname", "logout", "look", "lpc", "lpr", "lprm", "lsattr", "lsblk", "ls", "lsof", "lspci", "man", "info", "help", "mkdir", "mkfifo", "mkfile", "mknod", "mktemp", "more", "most", "mount", "mtools", "mtr", "mv", "mmv", "nc", "netcat", "netstat", "nft", "nice", "nl", "nohup", "notify-send", "nslookup", "open", "op", "passwd", "paste", "perf", "ping", "pgrep", "pkill", "popd", "pr", "printenv", "printf", "ps", "pushd", "pv", "pwd", "quota", "quotacheck", "ram", "rar", "rcp", "read", "readonly", "rename", "return", "rev", "rm", "rmdir", "screen", "scp", "sdiff", "sed", "select", "seq", "set", "shift", "shopt", "shutdown", "sleep", "slocate", "sort", "split", "ss", "ssh", "stat", "strace", "su", "sudo", "sum", "suspend", "sync", "tail", "tar", "tee", "test", "time", "timeout ", "times", "touch", "top", "tput", "traceroute", "trap", "tr", "true", "tsort", "tty", "type", "ulimit", "umask", "uname", "unexpand", "uniq", "units", "unrar", "unset", "unshar", "until", "useradd", "userdel", "usermod", "users", "uuencode", "uudecode", "vmstat ", "w", "wait ", "watch", "wc", "whereis", "which", "while", "who", "whoami", "write", "xargs", "xdg-open", "xz", "yes", "zip", "yum", "tree", "rpm", "git", "nano", "python", "last", "&", "&&", "(", ")", ";", ";;", "|", "||", "<", ">", ">|", "<<", ">>", "<&", ">&", "<<-", "<>", "vim", "vi", "!", "..", "/", "clear", "whatis", "emacs", "umount", "uptime", "ftp", "service", "free", "../../", "../"] 

# starting with one dash, followed by 1 to 4 word characters, end of string
single_dash_re = re.compile(r"^-\w{1,4}$")
# starts with a dash, followed by 1 to 4 groups of a dash and 1-10 word characters
double_dash_re = re.compile(r"^-(-\w{1,10}){1,4}$")

for line in sys.stdin:
    processed_words = []
    # shlex ignores quotes and treats quoted expressions as one word
    line = shlex.split(line)

    # skipping line numbers output by 'history' command
    try:
        int(line[0])
        line = line[1:]
    except ValueError:
        pass

    for word in line:
        word = word.lower()
        
        # keeping common commands from list above and operators 
        if word in known_commands:
            processed_words.append(word)

        # matching and keeping single dash flags such as -alt or -p (max 4 characters)
        elif single_dash_re.search(word):
            processed_words.append(word)

        # matching and keeping double dash flags such as --help or --follow-symlinks
        elif double_dash_re.search(word):
            processed_words.append(word)

        else:
            hashed = hashlib.pbkdf2_hmac('sha256', word.encode('utf-8'), salt, 1000, dklen=32)
            processed_words.append(base64.b64encode(hashed).decode('utf-8'))

    print(' '.join(processed_words))
