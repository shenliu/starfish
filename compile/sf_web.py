# coding=utf-8

import os

def together(path, *sele):
    str = ''
    for root, dirs, files in os.walk(path):
        offset = root.rfind("\\") + 1
        cur_dir = root[offset:]
        if not cur_dir in sele and cur_dir != path:
            continue

        for file in files:
            f = open(root + '/' + file, "r")
            for line in f:
                str += line
            f.close()
            
    f = open('../dist/starfish_web.js', 'w')
    f.write(str)
    f.close() 

if __name__ == '__main__':
    # base
    together('../src/web', 'web')
