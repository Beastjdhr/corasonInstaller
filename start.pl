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
print $pwd;
chomp $pwd;

if ($pwd=~ m/\//) {
	$pwd=~ s/\//\\\//g;
}
# wirting password to userData.txt
my $writePassword= `perl -pi -e 's/userPassword= <!<>!>/userPassword= <!<$pwd>!>/g' userData.txt`;
}

else {
    $pwd= $sudo;
}

#checking OS
my $OS= `uname -s`;

if ($OS =~ /Linux/) {
# checking if nodeJS is installed
# print "$sudo\n";
my $checkNode= `echo $pwd | sudo -S dpkg -l | grep nodejs`;

if (length($checkNode) < 3) {
    my $update=`echo $pwd | sudo -S apt-get -y update`;
    print "-------------------------_$update-----------------------";
#    if ($update=~ m/[error]/) {
 #       die "There seems to be a problem \n $update\n";
  #  }

	
    my $installNodeJS= `echo $pwd | curl -sL https://deb.nodesource.com/setup_8.x | sudo -E -S bash -
sudo apt-get install -y nodejs`;
    print "//////////////////////$installNodeJS//////////////////////";
    if ($installNodeJS=~ m/error/) {
        die "ERROR \n $installNodeJS";
    }
    my $installNPM= `echo $pwd | sudo -S apt-get -y install npm`;
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
print "DO NOT CLOSE THIS TERMINAL\n";
my $sc= `npm start`;
print $sc;

}
elsif ($OS=~ /Darwin/) {
    print "OS found\n";
    #checking node 
    my $isInstalled= `npm`;
    if ($isInstalled=~ /command not found/ig) {
        #checking brew
        my $isBrewInstalled= `brew`;
        if ($isBrewInstalled=~ /command not found/ig) {
            `echo $pwd | sudo -S -y /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`;
            `echo $pwd | sudo -S -y brew install node`;

        }
    }
    # my $nodejsInstalled= `nodejs`;
    # if ($nodejsInstalled=~ /command not found/gi || $nodejsInstalled=~ /no such file or directory/gi) {
    #     `npm install nodejs`;
    # }
    my $check8080= `lsof -i :8080`;
    if ($check8080=~ /nodejs/g) {
    # getting process's PID;
    $check8080=~ m/nodejs\s\s(\d+)\s/;
    my $PID= $1;
    print "About to kill process $PID\n";
    # killing nodejs process;
    `echo $pwd | sudo -S kill -9 $PID`;
    print "killed process $PID\n"
}
    print "DO NOT CLOSE THIS TERMINAL\n";
    my $sc= `npm start`;
    print $sc;
}



