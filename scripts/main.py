import os
import subprocess
import sys

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    this_file = os.path.basename(__file__)
    for fname in os.listdir(SCRIPTS_DIR):
        if fname.endswith('.py') and fname != this_file:
            script_path = os.path.join(SCRIPTS_DIR, fname)
            print(f"Running {fname} ...")
            result = subprocess.run([sys.executable, script_path])
            if result.returncode != 0:
                print(f"Script {fname} failed with exit code {result.returncode}")
            else:
                print(f"Script {fname} finished successfully.")

if __name__ == "__main__":
    main()
