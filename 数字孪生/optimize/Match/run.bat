:: Copyright Epic Games, Inc. All Rights Reserved.
@echo off

pushd %~dp0

title Matchmaker

::Run node server
node matchmaker %*

popd
pause