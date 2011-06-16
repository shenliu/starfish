# coding=utf-8

import os

def together(path, *sele):
    base= 'sf_starfish.js'
    str = ''
    for root, dirs, files in os.walk(path):
        offset = root.rfind("\\") + 1
        cur_dir = root[offset:]
        if not cur_dir in sele and cur_dir != path:
            continue
            
        if base in files:
            idx = files.index(base)
            obj = files.pop(idx)
            files.insert(0, obj)
            
        for file in files:
            f = open(root + '/' + file, "r")
            for line in f:
                str += line
            f.close()
            
    f = open('../dist/starfish-all.js', 'w')
    f.write(str)
    f.close() 

if __name__ == '__main__':
    # base
    together('../src', 'core', 'web')
