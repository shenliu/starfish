#!J:/Python/sdk/python3.2/python.exe
# -*- coding: utf-8 -*-

import glob

def makeall(path):
    dir = glob.glob(path + '*.js')
    idx = dir.index(path + 'sf_core.js')
    base = dir.pop(idx)
    dir.insert(0, base)
    
    str = ''
    for item in dir:   
        f = open(item, "r")
        for line in f:
            str += line
    f.close()
    f = open('..\\dist\\starfish-all.js', 'w')
    f.write(str)
    f.close()             

if __name__ == '__main__':
    makeall('..\\src\\')
