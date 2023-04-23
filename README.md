# DarkBASIC-VSCode

This extension is made to make DarkBASIC development easier on Visual Studio Code.<br/>

## Requirements

You are going to need a separate DarkBASIC executable (DB.exe) if you want to compile and execute the code directly from Visual Studio Code.<br/>

### npm requirements to build from source
vscode-debugadapter : version 1.41.0

## Features

- [WIP] Syntax highlight for DarkBASIC <br/>
<i>For now, only comments and <code>if</code> and <code>for</code> keywords are highlighted.</i><br/>
- Auto-generated <code>tasks.json</code> and <code>launch.json</code> to compile and execute DBA source code with an external compiler

## Extension Settings
If you want to use the external DB.exe compiler :
- After opening your DB project with VSCode, press <code>Ctrl+Shift+P</code> then research the command "Generate DarkBASIC Configuration Files".<br/>
- Point to your DB.exe compiler executable in the next dialog.<br/>
- Point to your main .DBA source file in the next dialog. This is the file that will be executed as an entry point of your DarkBASIC project. Press 'cancel' to use the current viewed DBA file as the entry point.<br/>
<br/>
You will be able to compile your code using <code>Ctrl+Shift+B</code> and/or directly execute using <code>F5</code> or <code>Ctrl+F5</code>

## Known Issues

- Missing keywords highlight<br/>
- Debug session won't stop automatically after exiting the executable
- Not working with DarkBASIC Pro (only tested with DarkBASIC Classic v1.09B)

## Release Notes

### 0.1.0
First release :
- Basic syntax highlight for DarkBASIC : comments, <code>if</code> and <code>for</code> keywords <br/>
- Auto-generated <code>tasks.json</code> and <code>launch.json</code>

---
