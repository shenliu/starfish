# -*- coding: utf-8 -*-

import glob
import os

str = ''
def makeall(path):
    core = 'sf_core.js'
    str = ''
    for root, dirs, files in os.walk(path):
        if core in files:
            idx = files.index(core)
            base = files.pop(idx)
            files.insert(0, base)
            
        for file in files:
            f = open(root + '/' + file, "r")
            for line in f:
                str += line
            f.close()
            
    f = open('../dist/starfish-all.js', 'w')
    f.write(str)
    f.close() 

if __name__ == '__main__':
    makeall('../src')
