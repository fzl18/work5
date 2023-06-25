:: Copyright Epic Games, Inc. All Rights Reserved.
@echo off

pushd %~dp0

title server

::Run node server
node app --s=1 %*

popd
pause