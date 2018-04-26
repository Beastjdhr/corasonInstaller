#!/usr/bin/perl
use warnings;
use strict;

my $pwd='';
# checking if the user has already given his user password
my $checkPassword= `grep userPassword userData.txt`;
$checkPassword=~ m/userPassword= <!<(.*)>!>/g;
my $sudo= $1;
# if the user has not given it, it qill be requested and then added to a file
if (length($sudo) < 2) {
print "This script needs your user password in order to install the required modules
if you agree, type your password and press ENTER. Else, type CTRL+C\n";
$pwd= <STDIN>;
# print $pwd;
chomp $pwd;
# wirting password to userData.txt
my $writePassword= `perl -pi -e 's/userPassword= <!<>!>/userPassword= <!<$pwd>!>/g' userData.txt`;
}

else {
    $pwd= $sudo;
}

# checking if nodeJS is installed
# print "$sudo\n";
my $checkNode= `echo $pwd | sudo -S dpkg -l | grep nodejs`;

if (length($checkNode) < 3) {
    my $update=`echo $pwd | sudo -S apt-get update`;
    print "-------------------------_$update-----------------------";
    if ($update=~ m/[error]/) {
        die "There seems to be a problem \n $update\n";
    }

    my $installNodeJS= `echo $pwd | sudo -S apt-get install nodejs`;
    print "//////////////////////$installNodeJS//////////////////////";
    if ($installNodeJS=~ m/error/) {
        die "ERROR \n $installNodeJS";
    }
    my $installNPM= `echo $pwd | sudo -S apt-get install npm`;
    print "<<<<<<<<<<<<<<<<<<<<<$installNPM>>>>>>>>>>>>>>>>>>>>>>>>>";
    if ($installNPM=~ m/error/) {
        die "ERROR \n $installNPM\n";
    }

}
# checking if there is a nodejs process running
my $check8080= `lsof -i :8080`;
print "$pwd\n";
if ($check8080=~ /nodejs/g) {
    # getting process's PID;
    $check8080=~ m/nodejs\s\s(\d+)\s/;
    my $PID= $1;
    print "About to kill process $PID\n";
    # killing nodejs process;
    `echo $pwd | sudo -S kill -9 $PID`;
    print "killed process $PID\n"
}
print "About to start server\n";
my $sc= `npm start`;
print $sc;


