import os
import subprocess

TARGET = "app"

INCLUDE = None #["Chart.jsx","useChart.js","App.jsx",]

tree = subprocess.run([f"tree {TARGET}"],shell=True,capture_output=True).stdout.decode().strip().split("\n")
tree = "\n".join(tree[:-1]).strip()
print("# Project structure:")
print(tree)
print()
print("# File contents:")

for root,dirs,files in os.walk(TARGET):
    for f in files:
        try:
            if INCLUDE is not None:
                if f not in INCLUDE: continue
            ext = f.split(".")[-1]
            path = os.path.join(root,f)
            with open(path,"r") as handle:
                text = handle.read().strip()
            s = f"```{ext} {path}\n{text}\n```"
            print(s)
        except Exception as e:
            raise Exception(f'Error in file {f}: {e}')
