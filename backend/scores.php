<?php

    function setScore(){
        if(isset($_POST["score"])){                    
            $myfile = fopen('score.json', "w");
            fwrite($myfile, $_POST["score"]);
            fclose($myfile);
        }

        print ($_POST["score"]);
    }

    function getScore(){
        $fp = fopen('score.json', "r");
        $txt = "";
        while (!feof ($fp)) {
            $txt = $txt . fgets($fp,4096);
        }
        fclose($fp); 
        $json = json_decode($txt);
        print json_encode($json);
    }

    if(isset($_POST["opt"])){
        $opt = $_POST["opt"];
        if($opt == 'set'){
            setScore();
        }else{
            getScore();
        }
    }    

?>